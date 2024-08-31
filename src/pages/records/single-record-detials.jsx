import {
  IconChevronUpRight,
  IconFileUpload,
  IconProgress,
} from "@tabler/icons-react";
import React, { useState } from "react";
import RecordDetialsHeader from "./components/record-detials-header";
import { useLocation, useNavigate } from "react-router-dom";
import FileUploadModel from "./components/file-upload-model";
import { useStatecontext } from "../../context";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";

const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

const SingleDecordDetials = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [progressing, setProgressing] = useState(false);

  const [analysisResult, setAnalysisResult] = useState(
    state.analysisResult || "",
  );

  const [filename, setFilename] = useState("");
  const [filetype, setFileType] = useState("");
  const [isModelOpen, setISModelOpen] = useState(false);

  const { updateRecord } = useStatecontext();

  const handleOpenModel = () => {
    setISModelOpen(true);
  };

  const handleCloseModel = () => {
    setISModelOpen(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    setFileType(file.type);
    setFilename(file.name);
    setFile(file);
  };

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };
  const handleFileUpload = async () => {
    setUploading(true);
    setUploadSuccess(false);

    const genAI = new GoogleGenerativeAI(geminiApiKey);

    try {
      const base64Data = await readFileAsBase64(file);

      const imageParts = [
        {
          inlineData: {
            data: base64Data,
            mimeType: filetype,
          },
        },
      ];

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-latest",
      });

      const prompt = `You are an expert cancer and any disease diagnosis analyst. Use your knowledge base to answer questions about giving personalized 
        recommended treatments.
        give a detailed treatment plan for me, make it more readable, clear and easy to understand make it paragraphs to make it more readable`;

      const results = await model.generateContent([prompt, ...imageParts]);
      const response = await results.response;
      const text = response.text();

      setAnalysisResult(text);

      const updatedRecordResponse = await updateRecord({
        documentId: state.id,
        analysisResult: text,
        kanbanRecords: "",
      });

      setUploadSuccess(true);
      setISModelOpen(false);
      setFile(null);
      setFilename("");
      setFileType("");
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadSuccess(false);
      setISModelOpen(false);
    } finally {
      setUploading(false);
    }
  };




  const processTreatmentPlan = async () => {
    setProgressing(true);
  
    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey);
  
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-latest"
      });
  
      const prompt = `You are an AI expert whose task is to analyze the following treatment plan:
  
      ${analysisResult}
      
      Based on this analysis, create a Kanban board with the following structure:
      
      {
        "columns": [
          { "id": "todo", "title": "Todo" },
          { "id": "doing", "title": "Work in progress" },
          { "id": "done", "title": "Done" }
        ],
        "tasks": [
          { "id": "1", "columnId": "todo", "content": "Example task 1" },
          { "id": "2", "columnId": "todo", "content": "Example task 2" },
          { "id": "3", "columnId": "doing", "content": "Example task 3" },
          { "id": "4", "columnId": "doing", "content": "Example task 4" },
          { "id": "5", "columnId": "done", "content": "Example task 5" }
        ]
      }
      
      Please return ONLY the JSON object, without any additional text, explanation, or comments.`;
  
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();  // Await the text response
  
      console.log('Raw response text:', text);  // Debugging: Check the raw response
  
      let parsedResponse;
  
      try {
        parsedResponse = JSON.parse(text);  // Parse the JSON response
      } catch (error) {
        console.error('Failed to parse JSON:', error);
        throw new Error('The model response was not in valid JSON format');
      }
  
      const updatedRecord = await updateRecord({
        documentId: state.id,
        kanbanRecords: text,
      });
  
      console.log('Updated record response:', updatedRecord);
  
      navigate(`/screening-schedules/`, {
        state: parsedResponse,
      });
  
    } catch (error) {
      console.error('Error processing treatment plan:', error);
    } finally {
      setProgressing(false);
    }
  };
  

  return (
    <div className="flex flex-wrap gap-[26px]">
      <button
        type="button"
        onClick={handleOpenModel}
        className="mt-6 inline-flex items-center gap-x-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-[#13131a] dark:text-white dark:hover:bg-neutral-800"
      >
        <IconFileUpload />
        Upload Reports
      </button>
      <FileUploadModel
        isOpen={isModelOpen}
        onClose={handleCloseModel}
        onFileChange={handleFileChange}
        onFileUpload={handleFileUpload}
        uploading={uploading}
        uploadSuccess={uploadSuccess}
        filename={filename}
      />
      {/* file upload model */}
      <RecordDetialsHeader recordName={state.recordName} />
      <div className="w-full">
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="inline-block min-w-full p-1.5 align-middle">
              <div className="overflow-hidden rounded-xl border-neutral-700 bg-[#13131a] shadow-sm">
                <div className="border-b border-neutral-700 px-6 py-4">
                  <h2 className="text-xl font-semibold text-neutral-200">
                    Personalized AI-Driven Treatment Plan
                  </h2>
                  <p className="text-sm text-neutral-400">
                    A tailored medical strategy leveraging advanced AI insights
                  </p>
                </div>
                <div className="flex w-full flex-col px-6 py-4 text-white">
                  <h2 className="text-lg font-semibold text-white">
                    Analysis Result
                  </h2>
                  <div className="space-y-2">
                    <ReactMarkdown>{analysisResult}</ReactMarkdown>
                  </div>
                </div>

                <div className="mt-5 grid gap-2 sm:flex">
                  <button
                    type="button"
                    onClick={processTreatmentPlan}
                    className="inline-flex items-center gap-x-2 rounded-lg border 
                    border-gray-200 bg-white px-3 py-2 text-sm font-medium 
                    text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none 
                    disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 
                    dark:text-white dark:hover:bg-neutral-800"
                  >
                    View Treatment Plan
                    <IconChevronUpRight size={20} />
                    {progressing && (
                      <IconProgress
                        size={10}
                        className="mr-3 h-5 w-5 animate-spin text-white"
                      />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleDecordDetials;
