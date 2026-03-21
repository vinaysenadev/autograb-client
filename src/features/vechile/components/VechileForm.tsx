import { Select } from "../../../components/ui/Select";
import logo from "../../../assets/logo-with-name.svg";
import { MODELS } from "../../../data";
import { useState } from "react";
import { useVehicleUpload } from "../hooks/useVehicleUpload";
const typedModels: Record<string, Record<string, string[]>> = MODELS;

const VechileForm = () => {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [badge, setBadge] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const { uploadVehicle, isLoading, error } = useVehicleUpload();

  const models =
    make && typedModels[make] ? Object.keys(typedModels[make]) : [];
  const badges =
    make && model && typedModels[make]?.[model] ? typedModels[make][model] : [];

  const handleMakeChange = (value: string) => {
    setMake(value);
    setModel("");
    setBadge("");
  };

  const handleModelChange = (value: string) => {
    setModel(value);
    setBadge("");
  };

  const handleQuickSelect = (make: string) => {
    const firstModel = Object.keys(typedModels[make])[0];
    const firstBadge = typedModels[make]?.[firstModel][0];

    setMake(make);
    setModel(firstModel);
    setBadge(firstBadge);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;

    if (!selectedFile) return;

    // ✅ Check extension
    if (!selectedFile.name.endsWith(".txt")) {
      alert("Only .txt files are allowed");
      return;
    }

    // ✅ Check MIME type (extra safety)
    if (selectedFile.type !== "text/plain") {
      alert("Invalid file type");
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let text = null;
    if (file) {
      text = await file.text();
    }
    if (!file || !make || !model || !badge) return;

    try {
      const data = await uploadVehicle({
        make,
        model,
        badge,
        fileContent: text,
      });
      console.log(data);
      console.log({ make, model, badge, file });
    } catch (error) {
      console.error(error);
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
            <Select value={make} onChange={handleMakeChange}>
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

          <div className="selectWrapper">
            <label className="label">Select Model</label>
            <Select value={model} onChange={handleModelChange} disabled={!make}>
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

          <div className="selectWrapper">
            <label className="label">Select Badge</label>
            <Select value={badge} onChange={setBadge} disabled={!model}>
              <Select.Trigger />
              <Select.Content>
                {badges.map((b: string) => (
                  <Select.Item key={b} value={b}>
                    <span className="capitalize">{b}</span>
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
                className="file-upload-input"
              />
            </label>
            {file && <p className="fileName">{file.name}</p>}
          </div>
          <div className="buttonWrapper">
            <button
              type="submit"
              className="fullWidthBtn"
              disabled={!make || !model || !badge || !file || isLoading}
              style={{
                background:
                  !make || !model || !badge || !file || isLoading
                    ? "#ccc"
                    : "#000000",
                color:
                  !make || !model || !badge || !file || isLoading
                    ? "#000000"
                    : "#ffffff",
              }}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
        {error && <p className="errorText">{error}</p>}
      </form>

      <div className="footer">© AutoGrab 2026</div>
    </section>
  );
};

export default VechileForm;
