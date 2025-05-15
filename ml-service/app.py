from fastapi import FastAPI, Request
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI()

# Load Hugging Face models
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
qa_model = pipeline("question-answering", model="distilbert-base-uncased-distilled-squad")
ner_model = pipeline("ner", grouped_entities=True, model="dslim/bert-base-NER")
classifier = pipeline("text-classification", model="bhadresh-savani/bert-base-uncased-emotion")

class QABody(BaseModel):
    context: str
    question: str

class TextBody(BaseModel):
    text: str

@app.post("/summarize")
def summarize_text(data: TextBody):
    summary = summarizer(data.text, max_length=130, min_length=30, do_sample=False)
    return {"summary": summary[0]["summary_text"]}

@app.post("/ner")
def named_entity_recognition(data: TextBody):
    entities = ner_model(data.text)
    return {"entities": entities}

@app.post("/classify")
def classify_risk(data: TextBody):
    result = classifier(data.text)
    return {"classification": result}

@app.post("/ask")
def question_answer(data: QABody):
    answer = qa_model(question=data.question, context=data.context)
    return {"answer": answer["answer"]}

