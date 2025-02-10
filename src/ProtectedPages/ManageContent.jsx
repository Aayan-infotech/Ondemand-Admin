import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import styles
import { IconButton, Button, Typography } from "@mui/material";
import { Edit, Visibility, Delete, Save } from "@mui/icons-material"; // Import Material-UI icons
import axios from "axios"; // You can use axios to send data to the backend

const ManageContent = () => {
  const [privacyPolicy, setPrivacyPolicy] = useState("Privacy & Policy content...");
  const [termsConditions, setTermsConditions] = useState("Terms & Conditions content...");
  const [isEditingPrivacy, setIsEditingPrivacy] = useState(false);
  const [isEditingTerms, setIsEditingTerms] = useState(false);
  const [isDeletedPrivacy, setIsDeletedPrivacy] = useState(false);
  const [isDeletedTerms, setIsDeletedTerms] = useState(false);

  const handlePrivacyChange = (value) => setPrivacyPolicy(value);
  const handleTermsChange = (value) => setTermsConditions(value);

  const handleEditPrivacy = () => setIsEditingPrivacy(true);
  const handleEditTerms = () => setIsEditingTerms(true);

  const handleViewPrivacy = () => setIsEditingPrivacy(false);
  const handleViewTerms = () => setIsEditingTerms(false);

  const handleDeletePrivacy = () => {
    setPrivacyPolicy("");
    setIsDeletedPrivacy(true);
  };

  const handleDeleteTerms = () => {
    setTermsConditions("");
    setIsDeletedTerms(true);
  };

  const handleSavePrivacy = async () => {
    try {
      await axios.post("http://44.196.64.110:3211/api/policies/update-policy", { content:privacyPolicy });
    } catch (err) {
      console.error("Error saving privacy policy:", err);
    }
  };

  const handleSaveTerms = async () => {
    try {
      await axios.post("http://44.196.64.110:3211/api/contents/update-terms", { content:termsConditions });

    } catch (err) {
      alert("Error saving terms & conditions");
    }
  };
useEffect(()=>{
console.log(termsConditions,privacyPolicy)
},[termsConditions,privacyPolicy])


  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Content</h2>

      {/* Privacy Policy Section */}
      {!isDeletedPrivacy && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <Typography fontWeight="bold">Privacy & Policy</Typography>
            {!isEditingPrivacy && (
              <IconButton onClick={handleEditPrivacy} color="primary">
                <Edit />
              </IconButton>
            )}
            {isEditingPrivacy && (
              <IconButton onClick={handleViewPrivacy} color="primary">
                <Visibility />
              </IconButton>
            )}
            <IconButton onClick={handleDeletePrivacy} color="secondary" style={{ marginLeft: "10px" }}>
              <Delete />
            </IconButton>
            {isEditingPrivacy && (
              <Button color="primary" onClick={handleSavePrivacy} style={{ marginLeft: "10px" }}>
                <Save style={{ marginRight: "5px" }} /> Save
              </Button>
            )}
          </div>

          {isEditingPrivacy ? (
            <ReactQuill value={privacyPolicy} onChange={handlePrivacyChange} theme="snow" style={{ height: "300px" }} />
          ) : (
            <div
              className="content-preview"
              dangerouslySetInnerHTML={{ __html: privacyPolicy }}
              style={{ marginTop: "20px", border: "1px solid #ccc", padding: "10px" }}
            />
          )}
        </>
      )}

      {/* Terms & Conditions Section */}
      {!isDeletedTerms && (
        <>
          <div style={{ marginTop: "30px", marginBottom: "20px" }}>
            <Typography fontWeight="bold">Terms & Conditions</Typography>
            {!isEditingTerms && (
              <IconButton onClick={handleEditTerms} color="primary">
                <Edit />
              </IconButton>
            )}
            {isEditingTerms && (
              <IconButton onClick={handleViewTerms} color="primary">
                <Visibility />
              </IconButton>
            )}
            <IconButton onClick={handleDeleteTerms} color="secondary" style={{ marginLeft: "10px" }}>
              <Delete />
            </IconButton>
            {isEditingTerms && (
              <Button color="primary" onClick={handleSaveTerms} style={{ marginLeft: "10px" }}>
                <Save style={{ marginRight: "5px" }} /> Save
              </Button>
            )}
          </div>

          {isEditingTerms ? (
            <ReactQuill value={termsConditions} onChange={handleTermsChange} theme="snow" style={{ height: "300px" }} />
          ) : (
            <div
              className="content-preview"
              dangerouslySetInnerHTML={{ __html: termsConditions }}
              style={{ marginTop: "20px", border: "1px solid #ccc", padding: "10px" }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ManageContent;
