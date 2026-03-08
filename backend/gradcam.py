import torch
import numpy as np
import cv2
import io
import base64
from PIL import Image

def generate_heatmap(image_bytes, model, extractor):

    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image_np = np.array(image)

    inputs = extractor(images=image, return_tensors="pt")

    pixel_values = inputs["pixel_values"]
    pixel_values.requires_grad = True

    outputs = model(pixel_values=pixel_values)
    logits = outputs.logits
    pred_class = torch.argmax(logits)

    model.zero_grad()
    logits[0, pred_class].backward()

    grads = pixel_values.grad.detach().cpu().numpy()[0]

    # collapse channels
    saliency = np.max(np.abs(grads), axis=0)

    saliency = saliency - saliency.min()
    saliency = saliency / (saliency.max() + 1e-8)

    saliency = cv2.resize(saliency, (image_np.shape[1], image_np.shape[0]))

    heatmap = np.uint8(255 * saliency)

    heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

    heatmap = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB)

    overlay = cv2.addWeighted(image_np, 0.5, heatmap, 0.7, 0)

    overlay_pil = Image.fromarray(overlay)

    buffer = io.BytesIO()
    overlay_pil.save(buffer, format="PNG")

    base64_heatmap = base64.b64encode(buffer.getvalue()).decode()

    return base64_heatmap