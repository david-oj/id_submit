import { useState, FormEvent } from "react";
import {
  MdOutlineBadge,
  MdOutlineCloudUpload,
  MdUploadFile,
} from "react-icons/md";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!e.target) {
      setError("input your ID image");
    }
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const res = await fetch("/api/submit", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Submission failed. Please try again.");
      }
      const { frontUrl, backUrl } = await res.json();
      alert(`Upload successful!\nFront: ${frontUrl}\nBack: ${backUrl}`);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Submission failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <div className="max-w-4xl mx-auto py-12 px-8">
          <div className="flex flex-col text-center items-center">
            <div className="flex justify-center items-center size-20 rounded-full mb-6 shadow-lg">
              <MdOutlineBadge className="text-white text-3xl " />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              ID Verification Portal
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Securely submit your identification documents for verification.
              Upload clear images or PDF files of both sides of your ID.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mt-12">
            <div className="flex items-center gap-4 size-8 ">
              <MdUploadFile className="text-2xl" />
              <h3 className="text-2xl font-semibold text-gray-800">
                Document Upload
              </h3>
            </div>
            <form
              onSubmit={onSubmit}
              encType="multipart/form-data"
              className="space-y-8"
            >
              <div className="flex mt-10 gap-4 md:gap-8 max-md:flex-col p-4 ">
                {/* Front Side */}
                <div className="flex-1">
                  <label htmlFor="">ID Front Side</label>
                  <div
                    onClick={(e) => {
                      e.currentTarget.querySelector("input")?.click();
                    }}
                    className="flex flex-col justify-center items-center gap-8 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-400 hover:bg-primary-50 transition-all duration-200 cursor-pointer group"
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
                        <img
                          src={URL.createObjectURL(frontFile)}
                          alt="Front preview"
                          className="max-h-32 object-contain"
                        />
                      ) : (
                        <p className="text-sm text-gray-700">
                          {frontFile.name}
                        </p>
                      )
                    ) : (
                      <>
                        <MdOutlineCloudUpload className="text-2xl" />
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
                  <label htmlFor="">ID Back Side</label>
                  <div
                    onClick={(e) => {
                      e.currentTarget.querySelector("input")?.click();
                    }}
                    className="flex flex-col justify-center items-center gap-8  border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-400 hover:bg-primary-50 transition-all duration-200 cursor-pointer group"
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
                        <img
                          src={URL.createObjectURL(backFile)}
                          alt="Front preview"
                          className="max-h-32 object-contain"
                        />
                      ) : (
                        <p className="text-sm text-gray-700">{backFile.name}</p>
                      )
                    ) : (
                      <>
                        <MdOutlineCloudUpload className="text-2xl" />
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
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                  <span className="material-symbols-outlined text-amber-600 mt-0.5">
                    info
                  </span>
                  <div>
                    <h4 className="font-semibold text-amber-800 mb-2">
                      Important Guidelines
                    </h4>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>Ensure your ID is clearly visible and not blurry</li>
                      <li>All text and details must be readable</li>
                      <li>Do not cover any part of the document</li>
                      <li>Files should be under 10MB in size</li>
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
                  documents are authentic. I understand that providing false
                  information may result in application rejection.
                </p>
              </div>
              <button
                type="submit"
                className="w-full px-8 py-2 bg-primary-500 text-black rounded-xl font-semibold hover:bg-primary-600 transition-all duration-200 transform hover:scale-102 shadow-sm hover:shadow-md"
                disabled={loading}
              >
                {loading ? "Uploading" : "Submit ID"}
              </button>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
