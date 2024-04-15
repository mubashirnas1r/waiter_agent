import os
from openai import OpenAI
import json
import pandas as pd
from dotenv import load_dotenv
load_dotenv()
from langchain_openai import OpenAIEmbeddings
from fastapi.middleware.cors import CORSMiddleware
from langchain_community.vectorstores import FAISS
from fastapi import FastAPI, Query

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
CHAT_MODEL = "gpt-4-0125-preview"
def list_folders(directory_path):
    try:
        folder_names = [folder for folder in os.listdir(directory_path) if os.path.isdir(os.path.join(directory_path, folder))]
        if folder_names == []:
            return False
        return folder_names
    except FileNotFoundError:
        print(f"The directory '{directory_path}' does not exist.")
        return False

# def search_products(keyword="Muchacha Nachos") -> str:
#     embeddings = OpenAIEmbeddings()
#     docs = None
#     persist_directory = f'database/vectorDB'
#     vectorized_products = list_folders(persist_directory)
#     print()
#     if vectorized_products != False:
#         print("Found Vectorized Products!")
#         products_vector_db = FAISS.load_local(f'database/vectorDB/{vectorized_products[0]}',embeddings,allow_dangerous_deserialization=True)
#         print("Merging Vectorized Products..")
#         for index in range(1,len(vectorized_products)):
#             persist_directory = f'database/vectorDB/{vectorized_products[index]}'
#             newVectordb= FAISS.load_local(persist_directory, embeddings,allow_dangerous_deserialization=True)
#             products_vector_db.merge_from(newVectordb)

#         print("Searching for Question in Products VectorDB...")
#         retriever =products_vector_db.as_retriever(search_type="mmr")
#         docs = retriever.get_relevant_documents(keyword,k=3)

#     else:
#         "No products Found."
        
#     print("Found Something...")
#     found_products = ""
#     for i, doc in enumerate(docs):
#         found_products += str(f"{i + 1}. {doc.page_content} \n")

#     return json.dumps({"products": found_products})
def search_product(id): #TODO: Make a list!
    products_df = pd.read_excel("database/products.xlsx")
    product = products_df[products_df['id_item'] == id]
    if not product.empty:
        return product.iloc[0].to_json()
    return {"error":f"no product with '{id}' found."}
def get_menu(name):
    return json.dumps({"menu_image_url":"https://muchacha.com/menu.png"})
def load_chats():
    file_path = "database/chats/conversations.json"
    with open(file_path, 'r') as file:
        conversations = json.load(file)
    return conversations
app = FastAPI()
origins = ["http://127.0.0.1:5502"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.post('/v1/chatbot/{conversation_id}/invoke')
async def run_conversation(
    conversation_id:str,
    query:str=Query(...)
):
    menu = pd.read_excel("database/products.xlsx")
    products = []
    for index, row in menu.iterrows():
        product_string = ''.join([f"{col}: {val}\n" for col, val in row.items() if col in ["id_item","item"]])
        products.append(product_string)
    PROMPT = f"""
You are OrderBot, an advanced automated system designed for Muchacha, a dynamic restaurant, aimed at optimizing the ordering process.
Your objective is to elevate the customer experience with these steps:

1) Initiate with a Warm Welcome:
Start by warmly greeting the customer. Promptly guide them according to their responses, ensuring a seamless initiation of their ordering experience.

2) Identify the Order Type:
Inquire at the outset whether the customer's order is for dine-in, delivery, or pick-up. This customization tailors the conversation to meet their specific needs, providing only relevant information for their chosen service mode.
Unless requested, do not provide information regarding other service modes.

3) Collect the order:
Present menu options in stages to engage without overwhelming, guiding decisions smoothly.
Start with drinks, followed by appetizers, mains, sides, desserts, and end with coffee/tea. This mirrors the dining experience, making choices feel intuitive.
Initially suggest broader options - example, for drinks: Would you like to see our selection of beers, soft drinks, or maybe a refreshing cocktail?
If appropriate, enrich with a few items per category (not more than 5), combining signature dishes, seasonal items, daily specials, and premium options to appeal to various tastes.
After initial recommendations, always suggest exploring more choices, fostering discovery.
Engage customers to understand their preferences, allowing for tailored suggestions that enhance the ordering experience.
Treat prices with discretion - do not provide info about it, unless requested. Once asked, provide the prices for all suggestions.
Do not describe an item after the client has ordered it, unless requested.
Below is the list of products we have got in our menu:
{str(products)}
4) Order Summary & Confirmation:
Once the customer finalizes their selection, provide a summary of the order, including prices of individual items and the total cost.
Ask if they would like to add anything else.

5) Delivery Details: For delivery orders, collect the customer's address. Do not display a map.
For pick-up orders, collect the intended time for pick-up, and make sure it is within restaurants working hours (11h am to 10h pm).

6) Payment Facilitation: Assist the customer with the payment process, whether directing them to pay at the counter or via an online payment link.

Important Considerations:
Verify the customer is over 18 years old before taking orders that include alcohol. 
Provide details such as calories and preparation time only upon request. 
Simplify price discussions by using the term "price" once the fulfillment method is chosen. 
Request all necessary details (options, extras, sizes) to accurately finalize the order, in accordance with the Muchacha menu. 
Indicate when an item is marked as 'Hot' for spicy; only display 'GF' for gluten-free or 'V' for vegetarian upon request. 
Base assistance strictly on the restaurant's menu for item availability, variations, pricing, and accurate guidance. 
Do not seek or access external information, including maps or websites. 
Only ask and answer questions related to the restaurant, the food, and the order—if asked, respond that you cannot discuss other subjects.

Communication Style:
Write in American English.
Maintain concise, engaging, and friendly responses, ensuring a conversational tone throughout the interaction.
Make the customer feel heard and understood.
Never use emojis, keeping communication professional.
Ensure order details are confirmed comprehensively to avoid misunderstandings and ensure clarity. 
Clarify any ambiguities, aiming for precise order accuracy.
"""
    chats = load_chats()
    try:
        messages = chats[conversation_id]["chat"][-50:]
        print("previous chat is loaded")
    except:
        print("new chat intialized")
        messages= [{"role":"system","content":PROMPT}]
    messages += [{"role":"user","content":query}] 
    tools = [
        {
            "type": "function",
            "function": {
                "name": "search_product",
                "description": "Get the product on the basis of provided id",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "id": {
                            "type": "integer",
                            "description": "ID of the product",
                        },
                    },
                    "required": ["id"],
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "get_menu",
                "description": "Get the image url of menu.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "name": {
                            "type": "string",
                            "description": "just pass muchacha",
                        },
                    },
                    "required": ["name"],
                },
            },
        }
    ]
    response = client.chat.completions.create(
        model=CHAT_MODEL,
        temperature=0,
        max_tokens=500,
        messages=messages,
        tools=tools,
        tool_choice="auto",
    )
    response_message = response.choices[0].message
    tool_calls = response_message.tool_calls
    if tool_calls:
        print("I want to call function")
        available_functions = {
            "search_product": search_product,
            "get_menu":get_menu
        }
        print(response_message)  
        messages.append(response_message)

        for tool_call in tool_calls:
            function_name = tool_call.function.name
            function_to_call = available_functions[function_name]
            function_args = json.loads(tool_call.function.arguments)
            if function_to_call.__name__ == "search_product":
                function_response = function_to_call(
                    id=function_args.get("id")
                )
            elif function_to_call.__name__ == "get_menu":
                function_response = function_to_call(
                    name=function_args.get("name")
                )
            messages.append(
                {
                    "tool_call_id": tool_call.id,
                    "role": "tool",
                    "name": function_name,
                    "content": function_response,
                }
            )
        second_response = client.chat.completions.create(
            model=CHAT_MODEL,
            messages=messages,
        )
        try:
            chats[conversation_id]["chat"] += [
                {"role":"user","content":query},
                {"role":"assistant","content":second_response.choices[0].message.content}
                
            ]
        except:
            chats[conversation_id] = {
                "chat": [
                    {"role":"system","content":PROMPT},
                    {"role": "user", "content": query},
                    {"role": "assistant", "content": second_response.choices[0].message.content}

                ]
                
            }
        file_path = "database/chats/conversations.json"
        with open(file_path, 'w') as file:
            json.dump(chats, file, indent=4)  
        return {
            "message":second_response.choices[0].message.content,
            "function_response":function_response
        }
    else:
        try:
            chats[conversation_id]["chat"] += [
                {"role":"user","content":query},
                {"role":"assistant","content":response.choices[0].message.content}
            ]
        except:
            chats[conversation_id] = {
                "chat": [
                    {"role":"system","content":PROMPT},
                    {"role": "user", "content": query},
                    {"role": "assistant", "content": response.choices[0].message.content}
                ]
                
            }
        file_path = "database/chats/conversations.json"
        with open(file_path, 'w') as file:
            json.dump(chats, file, indent=4)
        return {
            "message":response.choices[0].message.content,
            "function_response": {}
        } 
        
#TODO: (Search single product ✅), book-online link (we have to add this in cards), cards-generation function, prompt - fixture
# (WRITE names and ids of all products in prompt ✅)