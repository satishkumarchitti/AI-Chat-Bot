import os
import json
from typing import Dict, Any, Optional
import google.generativeai as genai
from PIL import Image
import PyPDF2
from config import settings

# Configure Gemini
genai.configure(api_key=settings.GOOGLE_API_KEY)


class AIDocumentExtractor:
    """AI service for extracting structured data from documents using Gemini"""
    
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-2.0-flash')
    
    def extract_text_from_image(self, image_path: str) -> str:
        """Extract text from image using Gemini Vision"""
        try:
            image = Image.open(image_path)
            response = self.model.generate_content([
                "Extract all text from this image accurately.",
                image
            ])
            return response.text
        except Exception as e:
            print(f"Error extracting text from image: {e}")
            return ""
    
    def extract_text_from_pdf(self, pdf_path: str) -> str:
        """Extract text from PDF - handles both text-based and scanned PDFs"""
        try:
            # First, try PyPDF2 for text-based PDFs
            text = ""
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
            
            # If text is empty or too short, it's likely a scanned PDF
            if not text or len(text.strip()) < 50:
                print(f"PDF appears to be scanned (no text found). Using Gemini Vision...")
                # Convert PDF to images and use Gemini Vision
                try:
                    from pdf2image import convert_from_path
                    images = convert_from_path(pdf_path)
                    
                    all_text = []
                    for i, image in enumerate(images):
                        print(f"Processing page {i+1}/{len(images)}...")
                        response = self.model.generate_content([
                            "Extract all text from this PDF page accurately. Return only the text, no descriptions.",
                            image
                        ])
                        all_text.append(response.text)
                    
                    text = "\n\n".join(all_text)
                    print(f"Extracted {len(text)} characters using Gemini Vision")
                except ImportError:
                    print("pdf2image not installed. Trying direct Gemini PDF processing...")
                    # Fallback: Try Gemini's native PDF support
                    with open(pdf_path, 'rb') as f:
                        pdf_data = f.read()
                    response = self.model.generate_content([
                        "Extract all text from this PDF document accurately. Return only the text, no descriptions.",
                        {"mime_type": "application/pdf", "data": pdf_data}
                    ])
                    text = response.text
                    
            return text
        except Exception as e:
            print(f"Error extracting text from PDF: {e}")
            return ""
    
    def extract_structured_data(self, file_path: str, file_type: str) -> Dict[str, Any]:
        """
        Extract structured data from document using LangGraph workflow
        """
        # Extract text based on file type
        if file_type == "image":
            raw_text = self.extract_text_from_image(file_path)
        else:  # pdf
            raw_text = self.extract_text_from_pdf(file_path)
        
        if not raw_text:
            return {"error": "Could not extract text from document"}
        
        # Use Gemini to extract structured data
        prompt = f"""
        Analyze the following document text and extract structured data in JSON format.
        
        Expected fields for utility bills/receipts:
        - vendor_name: Name of the vendor/company
        - vendor_address: Address of the vendor
        - document_type: Type of document (bill, receipt, invoice, etc.)
        - document_number: Document/Invoice number
        - date: Date on the document
        - due_date: Due date (if applicable)
        - total_amount: Total amount
        - currency: Currency code (USD, EUR, etc.)
        - tax_amount: Tax amount
        - subtotal: Subtotal before tax
        - line_items: List of line items with description and amount
        - payment_method: Payment method (if mentioned)
        - account_number: Account number (if applicable)
        
        Extract as many fields as possible. If a field is not found, use null.
        Return ONLY valid JSON, no additional text.
        
        Document text:
        {raw_text}
        """
        
        try:
            response = self.model.generate_content(prompt)
            result_text = response.text.strip()
            
            # Clean up the response to extract JSON
            if "```json" in result_text:
                result_text = result_text.split("```json")[1].split("```")[0].strip()
            elif "```" in result_text:
                result_text = result_text.split("```")[1].split("```")[0].strip()
            
            extracted_data = json.loads(result_text)
            return extracted_data
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON: {e}")
            print(f"Raw response: {response.text}")
            # Return basic extracted text as fallback
            return {
                "raw_text": raw_text[:500],
                "error": "Could not parse structured data",
                "raw_response": response.text
            }
        except Exception as e:
            print(f"Error in structured data extraction: {e}")
            return {"error": str(e), "raw_text": raw_text[:500]}


class AIChatbot:
    """AI chatbot for answering questions about extracted data"""
    
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-2.0-flash')
    
    def answer_question(
        self,
        question: str,
        extracted_data: Dict[str, Any],
        chat_history: Optional[list] = None
    ) -> str:
        """
        Answer questions about the extracted data using Gemini
        """
        # Format the extracted data for context
        data_context = json.dumps(extracted_data, indent=2)
        
        # Build chat history context
        history_context = ""
        if chat_history:
            history_context = "\n\nPrevious conversation:\n"
            for msg in chat_history[-5:]:  # Last 5 messages
                history_context += f"User: {msg.get('message', '')}\n"
                history_context += f"Assistant: {msg.get('response', '')}\n"
        
        # Create the prompt
        system_prompt = f"""You are a helpful AI assistant specialized in analyzing document data.
        You have access to the following extracted data from a document:
        
        {data_context}
        
        {history_context}
        
        Answer the user's question based on this data. Be concise and accurate.
        If the information is not available in the data, politely say so.
        """
        
        try:
            full_prompt = f"{system_prompt}\n\nUser Question: {question}"
            response = self.model.generate_content(full_prompt)
            return response.text
        except Exception as e:
            print(f"Error in chatbot: {e}")
            return "I apologize, but I encountered an error processing your question. Please try again."


# Initialize global instances
document_extractor = AIDocumentExtractor()
chatbot = AIChatbot()
