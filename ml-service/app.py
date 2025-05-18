from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
import logging

app = FastAPI()

# ✅ Load Hugging Face pipelines
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
qa_model = pipeline("question-answering", model="distilbert-base-uncased-distilled-squad")
ner_model = pipeline("ner", model="dslim/bert-base-NER", grouped_entities=True)
classifier = pipeline("text-classification", model="bhadresh-savani/bert-base-uncased-emotion")

# ✅ Input schemas
class QABody(BaseModel):
    context: str
    question: str

class TextBody(BaseModel):
    text: str

# ✅ Health check route
@app.get("/")
def root():
    return {"message": "ML service is running!"}

# ✅ Summarization
@app.post("/summarize")
def summarize_text(data: TextBody):
    try:
        text = data.text.strip()
        if not text or len(text) < 30:
            return {"summary": "Text too short to summarize."}
        if len(text) > 2000:
            text = text[:2000]

        summary = summarizer(text, max_length=130, min_length=30, do_sample=False)
        return {"summary": str(summary[0]["summary_text"])}
    except Exception as e:
        logging.exception("Summarization failed")
        return {"error": str(e)}

# ✅ Named Entity Recognition (NER)
@app.post("/ner")
def named_entity_recognition(data: TextBody):
    try:
        text = data.text.strip()
        if not text:
            return {"entities": []}
        if len(text) > 1500:
            text = text[:1500]

        raw_entities = ner_model(text)
        entities = [
            {
                "entity_group": ent.get("entity_group", ""),
                "score": float(ent.get("score", 0)),
                "word": ent.get("word", ""),
                "start": int(ent.get("start", 0)),
                "end": int(ent.get("end", 0))
            }
            for ent in raw_entities
        ]
        return {"entities": entities}
    except Exception as e:
        logging.exception("NER failed")
        return {"error": str(e)}

# ✅ Classification
@app.post("/classify")
def classify_risk(data: TextBody):
    try:
        text = data.text.strip()
        if not text:
            return {"classification": []}
        if len(text) > 512:
            text = text[:512]

        results = classifier(text)
        clauses = [{
            "clause": text[:100],
            "riskLevel": str(result["label"]).title(),
            "score": float(result["score"])
        } for result in results]

        return {"classification": clauses}
    except Exception as e:
        logging.exception("Classification failed")
        return {"error": str(e)}

# ✅ Question Answering
@app.post("/ask")
def question_answer(data: QABody):
    try:
        if not data.context.strip() or not data.question.strip():
            return {"answer": "Missing question or context."}

        answer = qa_model(question=data.question, context=data.context)
        return {"answer": str(answer["answer"])}
    except Exception as e:
        logging.exception("Q&A failed")
        return {"error": str(e)}

# ✅ Combined Document Analysis
@app.post("/analyze")
def analyze_document(data: TextBody):
    try:
        text = data.text.strip()
        if not text:
            return {"error": "No text provided for analysis."}
        if len(text) > 3000:
            text = text[:3000]

        summary = summarizer(text, max_length=130, min_length=30, do_sample=False)[0]['summary_text']

        raw_entities = ner_model(text)
        entities = [
            {
                "entity_group": ent.get("entity_group", ""),
                "score": float(ent.get("score", 0)),
                "word": ent.get("word", ""),
                "start": int(ent.get("start", 0)),
                "end": int(ent.get("end", 0))
            }
            for ent in raw_entities
        ]

        classification = classifier(text)
        clauses = [{
            "clause": text[:100],
            "riskLevel": str(result["label"]).title(),
            "score": float(result["score"])
        } for result in classification]

        return {
            "summary": summary,
            "entities": entities,
            "classification": clauses
        }
    except Exception as e:
        logging.exception("Analysis failed")
        return {"error": str(e)}

# ✅ ChatAI Assistant Endpoint
@app.post("/chat")
def chat_with_doc(data: QABody):
    try:
        if not data.context.strip() or not data.question.strip():
            return {"answer": "Missing input."}

        result = qa_model(question=data.question, context=data.context)
        return {"answer": result["answer"]}
    except Exception as e:
        logging.exception("Chat failed")
        return {"error": str(e)}
