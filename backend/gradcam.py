import torch
import numpy as np
from PIL import Image
import io
import base64
import cv2


def generate_heatmap(image_bytes, model, extractor):

    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image_np = np.array(image)

    inputs = extractor(images=image, return_tensors="pt")
    input_tensor = inputs["pixel_values"]
    input_tensor.requiresgrad(True)

    outputs = model(pixel_values=input_tensor)
    logits = outputs.logits
    predicted_class = torch.argmax(logits)

    model.zero_grad()
    logits[0, predicted_class].backward()

    gradients = input_tensor.grad[0].detach().numpy()

    heatmap = np.mean(np.abs(gradients), axis=0)

    heatmap = heatmap / (heatmap.max() + 1e-8)

    heatmap = cv2.resize(heatmap, (image_np.shape[1], image_np.shape[0]))

    heatmap = np.uint8(255 * heatmap)
    heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

    heatmap = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB)

    overlay = cv2.addWeighted(image_np, 0.6, heatmap, 0.4, 0)

    overlay_pil = Image.fromarray(overlay)

    buffer = io.BytesIO()
    overlay_pil.save(buffer, format="PNG")

    heatmap_base64 = base64.b64encode(buffer.getvalue()).decode()

    return heatmap_base64