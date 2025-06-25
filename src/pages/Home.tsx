import { useState, FormEvent } from "react";
import {
  MdOutlineBadge,
  MdOutlineCloudUpload,
  MdUploadFile,
  MdAutorenew,
} from "react-icons/md";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [statusColor, setStatusColor] = useState<string | null>(null);
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const formData = new FormData(e.target as HTMLFormElement);

      //   // 💡 DEBUG: log every entry
      //   for (const [key, value] of formData.entries()) {
      //     console.log("FormData entry:", key, value);
      //   }

      const res = await fetch("/api/submit", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Submission failed. Please try again.");
      }
      //   const { frontUrl, backUrl } = await res.json();
      //   alert(`Upload successful!\nFront: ${frontUrl}\nBack: ${backUrl}`);

      const success = await res.json();
      setStatusColor("text-green-500");
      setMessage(success.message);

      (e.target as HTMLFormElement).reset();
    } catch (err) {
      console.error(err);
      setMessage(
        err instanceof Error
          ? err.message
          : "Submission failed. Please try again."
      );
      setStatusColor("text-red-500");
    } finally {
      setLoading(false);
      setFrontFile(null);
      setBackFile(null);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <div className="max-w-4xl mx-auto md:py-12 py-4 md:px-8 px-4">
          <div className="flex flex-col text-center items-center">
            <div className="bg-primary flex justify-center items-center md:size-20 size-16 rounded-full mb-6 shadow-lg">
              <MdOutlineBadge className="text-white text-3xl " />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
              ID Verification Portal
            </h1>
            <p className="md:text-xl text-gray-600 max-w-2xl mx-auto">
              Securely submit your identification documents.
              Upload clear images or PDF files of both sides of your ID.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl max-sm:py-8 p-4 sm:p-8 md:p-12 mt-12">
            <div className="flex items-center gap-4 ">
              <MdUploadFile className="text-2xl text-primary" />
              <h3 className="text-2xl font-semibold text-gray-800">
                Document Upload
              </h3>
            </div>
            <form
              onSubmit={onSubmit}
              encType="multipart/form-data"
              className="space-y-4 sm:space-y-8"
            >
              <div className="flex mt-6 sm:mt-10 gap-4 md:gap-8 max-md:flex-col p-4 ">
                {/* Front Side */}
                <div className="flex-1">
                  <label htmlFor="id_front">ID Front Side</label>
                  <div
                    onClick={(e) => {
                      e.currentTarget.querySelector("input")?.click();
                    }}
                    className={`${
                      frontFile ? "border-green-400" : ""
                    } flex flex-col justify-center items-center sm:gap-4 gap-2 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-400 hover:bg-primary/5 transition-all duration-200 cursor-pointer group`}
                  >
                    <input
                      type="file"
                      name="id_front"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const file = e.target.files?.[0] ?? null;
                        setFrontFile(file);
                      }}
                    />

                    {frontFile ? (
                      frontFile.type.startsWith("image/") ? (
                        <div className="h-[144px] overflow-hidden">
                          <img
                            src={URL.createObjectURL(frontFile)}
                            alt="Front preview"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <p className="text-sm text-gray-700">
                          {frontFile.name}
                        </p>
                      )
                    ) : (
                      <>
                        <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center-safe">
                          <MdOutlineCloudUpload className="text-2xl text-primary" />
                        </div>
                        <p className="text-lg font-medium text-gray-700">
                          Drop files here or click upload
                        </p>
                        <p className="text-sm text-gray-500">
                          Supports: JPG, PNG, PDF (Max 10MB)
                        </p>
                      </>
                    )}
                  </div>
                </div>
                {/* Back Side */}
                <div className="flex-1">
                  <label htmlFor="id_back">ID Back Side</label>
                  <div
                    onClick={(e) => {
                      e.currentTarget.querySelector("input")?.click();
                    }}
                    className={`${
                      backFile ? "border-green-400" : ""
                    } flex flex-col justify-center items-center sm:gap-4 gap-2 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-400 hover:bg-primary/5 transition-all duration-200 cursor-pointer group`}
                  >
                    <input
                      type="file"
                      name="id_back"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const file = e.target.files?.[0] ?? null;
                        setBackFile(file);
                      }}
                    />
                    {backFile ? (
                      backFile.type.startsWith("image/") ? (
                        <div className="h-[136px] overflow-hidden ">
                          <img
                            src={URL.createObjectURL(backFile)}
                            alt="Front preview"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <p className="text-sm text-gray-700">{backFile.name}</p>
                      )
                    ) : (
                      <>
                        <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center-safe">
                          <MdOutlineCloudUpload className="text-2xl text-primary" />
                        </div>
                        <p className="text-lg font-medium text-gray-700">
                          Drop files here or click upload
                        </p>
                        <p className="text-sm text-gray-500">
                          Supports: JPG, PNG, PDF (Max 10MB)
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-6">
                <div className="flex items-start space-x-3">
                  <span className="material-symbols-outlined text-amber-600 mt-0.5">
                    info
                  </span>
                  <div>
                    <h4 className="font-semibold text-amber-800 mb-2">
                      Important Guidelines
                    </h4>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>• Ensure your ID is clearly visible and not blurry</li>
                      <li>• All text and details must be readable</li>
                      <li>• Do not cover any part of the document</li>
                      <li>• Files should be under 10MB in size</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-100/50 flex items-start gap-3 ">
                <input
                  type="checkbox"
                  className="size-5 border-gray-300 focus:ring-primary-500"
                />
                <p className="text-sm text-gray-500">
                  I confirm that the information provided is accurate and the
                  documents are authentic.
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  type="reset"
                  className="flex-1 px-8 py-2 border border-black/50 text-black rounded-xl font-semibold hover:bg-primary-600 transition-all duration-200 transform hover:scale-101 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
                  onClick={() => {
                    setFrontFile(null);
                    setBackFile(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-8 py-2 bg-primary active:scale-99 text-white rounded-xl font-semibold hover:bg-primary-600 transition-all duration-200 transform hover:scale-101 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex justify-center items-center gap-2">
                      <MdAutorenew className="size-6 animate-spin text-white" />
                      Uploading
                    </span>
                  ) : (
                    "Submit ID"
                  )}
                </button>
              </div>
              {message && <p className={`text-sm ${statusColor}`}>{message}</p>}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
