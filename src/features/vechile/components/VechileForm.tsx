import { useState } from "react";

import { Select } from "../../../components/ui/select/Select";
import logo from "../../../assets/logo-with-name.svg";
import { MODELS } from "../../../data";
import { useVehicleUpload } from "../hooks/useVehicleUpload";

const typedModels: Record<string, Record<string, string[]>> = MODELS;

type FormErrors = {
  make?: string;
  model?: string;
  badge?: string;
  file?: string;
};

const VechileForm = () => {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [badge, setBadge] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMsg, setSuccessMsg] = useState("");

  const { uploadVehicle, isLoading, error } = useVehicleUpload();

  const models =
    make && typedModels[make] ? Object.keys(typedModels[make]) : [];
  const badges =
    make && model && typedModels[make]?.[model] ? typedModels[make][model] : [];

  const handleQuickSelect = (make: string) => {
    const firstModel = Object.keys(typedModels[make])[0];
    const firstBadge = typedModels[make]?.[firstModel][0];

    setMake(make);
    setModel(firstModel);
    setBadge(firstBadge);
    setErrors((prev) => ({ ...prev, make: "", model: "", badge: "" }));
    setSuccessMsg("");
  };
  const handleMakeChange = (value: string) => {
    setMake(value);
    setModel("");
    setBadge("");
    setErrors((prev) => ({ ...prev, make: "", model: "", badge: "" }));
    setSuccessMsg("");
  };

  const handleModelChange = (value: string) => {
    setModel(value);
    setBadge("");
    setErrors((prev) => ({ ...prev, model: "", badge: "" }));
    setSuccessMsg("");
  };

  const handleResetFile = (e: React.MouseEvent<HTMLInputElement>) => {
    (e.target as HTMLInputElement).value = "";
    setFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;

    setErrors((prev) => ({ ...prev, file: "" }));
    setSuccessMsg("");

    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".txt")) {
      setErrors((prev) => ({ ...prev, file: "Only .txt files are allowed" }));
      return;
    }

    if (selectedFile.type !== "text/plain") {
      setErrors((prev) => ({ ...prev, file: "Invalid file type" }));
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        file: "File size exceeds the 5MB limit",
      }));
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMsg("");

    const newErrors: FormErrors = {};
    if (!make) newErrors.make = "Please select a make";
    if (!model) newErrors.model = "Please select a model";
    if (!badge) newErrors.badge = "Please select a badge";
    if (!file) newErrors.file = "Please upload a logbook file";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    let text = null;
    if (file) {
      text = await file.text();
    }

    try {
      await uploadVehicle({
        make,
        model,
        badge,
        fileContent: text,
      });

      setSuccessMsg("Vehicle details and logbook uploaded successfully!");
    } catch (err) {
      // The API error is already handled and provided by the useVehicleUpload hook
      console.error(err);
    }
  };

  return (
    <section className="form-section">
      <div className="logo">
        <img src={logo} alt="autograb logo" className="" width={150} />
        <h2 className="">Vechile Selection</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-container">
          <div className="quickSelectWrapper">
            <span className="label">Quick select</span>
            {Object.keys(MODELS)
              .slice(0, 3)
              .map((model) => (
                <button
                  type="button"
                  className="quickSelectButton"
                  key={model}
                  onClick={() => handleQuickSelect(model)}
                >
                  <span className="capitalize">{model}</span>
                </button>
              ))}
          </div>

          <div className="selectWrapper">
            {/* Make */}
            <label className="label">Select Make</label>
            <Select
              value={make}
              onChange={handleMakeChange}
              error={errors.make}
            >
              <Select.Trigger />
              <Select.Content>
                {Object.keys(MODELS).map((model) => (
                  <Select.Item key={model} value={model}>
                    <span className="capitalize">{model}</span>
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </div>
          {/* Model */}
          <div className="selectWrapper">
            <label className="label">Select Model</label>
            <Select
              value={model}
              onChange={handleModelChange}
              disabled={!make}
              error={errors.model}
            >
              <Select.Trigger />
              <Select.Content>
                {models.map((m) => (
                  <Select.Item key={m} value={m}>
                    <span className="capitalize"> {m}</span>
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </div>
          {/* Badge */}
          <div className="selectWrapper">
            <label className="label">Select Badge</label>
            <Select
              value={badge}
              onChange={(val) => {
                setBadge(val);
                setErrors((p) => ({ ...p, badge: "" }));
              }}
              disabled={!model}
              error={errors.badge}
            >
              <Select.Trigger />
              <Select.Content>
                {badges.map((badge: string) => (
                  <Select.Item key={badge} value={badge}>
                    <span className="capitalize">{badge}</span>
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </div>

          <div className="selectWrapper fileUpload">
            <label className="fileInput label">
              <span className="icon material-symbols-outlined">upload</span>
              Upload file
              <input
                type="file"
                accept=".txt"
                onChange={handleFileChange}
                onClick={handleResetFile}
                className="file-upload-input"
              />
            </label>
            {file && <p className="fileName">{file.name}</p>}
            {errors.file && <p className="errorMessage">{errors.file}</p>}
          </div>
          <div className="buttonWrapper">
            <button
              type="submit"
              disabled={isLoading}
              className="fullWidthBtn"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "0.5rem",
                backgroundColor: isLoading ? "rgba(0,0,0,0.7)" : "#000",
              }}
            >
              {isLoading ? (
                <>
                  <span
                    className="material-symbols-outlined spinner"
                    style={{ fontSize: "1.5rem" }}
                  >
                    sync
                  </span>
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </button>
            {error && <p className="failureText">{error}</p>}
            {successMsg && <p className="successText">{successMsg}</p>}
          </div>
        </div>
      </form>

      <div className="footer">© AutoGrab 2026</div>
    </section>
  );
};

export default VechileForm;
