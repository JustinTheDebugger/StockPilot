import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { v4 } from "uuid";
import Header from "@/app/(components)/Header";

type ProductFormData = {
  name: string;
  price: number;
  stockQuantity: number;
  rating: number;
};

type CreateProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: ProductFormData) => void;
};

const productFormFields = [
  {
    label: "Product Name",
    name: "name",
    type: "text",
    placeholder: "Name",
  },
  {
    label: "Price",
    name: "price",
    type: "number",
    placeholder: "Price",
  },
  {
    label: "Stock Quantity",
    name: "stockQuantity",
    type: "number",
    placeholder: "Stock Quantity",
  },
  {
    label: "Rating",
    name: "rating",
    type: "number",
    placeholder: "Rating",
  },
];

const CreateProductModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateProductModalProps) => {
  const initialFormState = () => ({
    productId: v4(),
    name: "",
    price: 0,
    stockQuantity: 0,
    rating: 0,
  });

  // Adding state hooks
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormState());
      setStatusMessage("");
      setStatusType("");
    }
  }, [isOpen]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "price" || name === "stockQuantity" || name === "rating"
          ? parseFloat(value)
          : value,
    });

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stockQuantity" || name === "rating"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setStatusMessage("");
    setStatusType("");

    // Validate product name is not just spaces
    if (formData.name.trim() === "") {
      setStatusMessage("Product name cannot be empty.");
      setStatusType("error");
      setIsSubmitting(false);
      return;
    }

    try {
      await onCreate(formData);

      setStatusMessage("Product created successfully.");
      setStatusType("success");
      setFormData(initialFormState());
      // onClose();
    } catch (error) {
      setStatusMessage("Failed to create product. Please try again.");
      setStatusType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles =
    "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";
  const divider = <hr className="w-full border-t border-gray-300 my-4" />;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto border w-96 shadow-lg rounded-md bg-white">
        <div className="px-5 pt-5">
          <Header name="Create New Product" />
        </div>

        {divider}

        {statusMessage && (
          <div
            className={`px-5 text-sm mb-2 ${
              statusType === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {statusMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="px-5 pb-5 mt-5">
            {productFormFields.map(({ label, name, type, placeholder }) => (
              <div key={name}>
                <label htmlFor={name} className={labelCssStyles}>
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  placeholder={placeholder}
                  value={(formData as any)[name]}
                  onChange={handleChange}
                  className={inputCssStyles}
                  required
                  pattern={name === "name" ? ".*\\S.*" : undefined}
                  title={
                    name === "name"
                      ? "Product name cannot be empty or only spaces"
                      : undefined
                  }
                />
              </div>
            ))}
          </div>

          {divider}

          {/* Action buttons */}
          <div className="flex flex-row-reverse px-5 pb-4 gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 text-white rounded ${
                isSubmitting
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Creating..." : "Create"}
            </button>

            <button
              onClick={onClose}
              type="button"
              className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductModal;
