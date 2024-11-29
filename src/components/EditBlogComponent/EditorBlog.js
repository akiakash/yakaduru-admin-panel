import React, { Component } from "react";
import ReactQuill, { Quill } from "react-quill";
import ImageUploader from "quill-image-uploader";

// Register the image uploader module
Quill.register("modules/imageUploader", ImageUploader);

class EditorBlog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: props.value || "", // Set initial value from props
    };
  }

  modules = {
    toolbar: {
      container: [
        ["bold", "italic", "image"], // Text formatting
        [{ list: "ordered" }, { list: "bullet" }], // Lists
        [{ header: "1" }, { header: "2" }, { header: "3" }], // Heading levels
        [{ align: [] }], // Text alignment (left, center, right)
        ["link", "blockquote", "code-block"], // Links, blockquotes, and code
      ],
      handlers: {
        image: this.imageHandler,
      },
    },
  };

  imageHandler = () => {
    console.log("step1");
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("image", file);

        try {
          const response = await fetch(
            "http://localhost:3002/api/upload-multiple",
            {
              method: "POST",
              body: formData,
            },
          );
          if (!response.ok)
            throw new Error(`Upload failed: ${response.statusText}`);

          const result = await response.json();
          if (result.success && result.urls?.length > 0) {
            const quill = this.reactQuillRef.getEditor();
            const range = quill.getSelection();
            quill.insertEmbed(range.index, "image", result.urls[0]);
          } else {
            console.error("Invalid response:", result);
          }
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      }
    };
  };

  formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "indent",
    "link",
    "image",
  ];

  handleChange = (value) => {
    this.setState({ text: value });
    if (this.props.onChange) {
      this.props.onChange(value); // Pass the updated value back to the parent component
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.setState({ text: this.props.value }); // Update state if parent value changes
    }
  }

  render() {
    return (
      <ReactQuill
        theme="snow"
        modules={this.modules}
        formats={this.formats}
        value={this.state.text} // Use state for value
        style={{ height: "500px" }}
        onChange={this.handleChange}
      />
    );
  }
}

export default EditorBlog;
