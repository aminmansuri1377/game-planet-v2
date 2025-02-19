// utils/uploadImage.ts
import { supabase } from "./supabaseClient";

export async function uploadImage(file: File): Promise<string> {
  // Generate a unique file name
  const fileName = `${Date.now()}-${file.name}`;

  try {
    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from("product-images") // Your bucket name
      .upload(`products/${fileName}`, file);

    if (error) {
      console.error("Failed to upload image:", error);
      throw new Error("Failed to upload image");
    }

    // Get the public URL of the uploaded file
    const { data: publicUrl } = supabase.storage
      .from("product-images")
      .getPublicUrl(data.path);

    return publicUrl.publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Error uploading image");
  }
}
