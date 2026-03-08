import traceback, sys

try:
    from model import run_image_detection, load_model, run_text_detection, run_audio_detection
    print("model imports OK")
except Exception as e:
    print("model import ERROR:", e)
    traceback.print_exc()

try:
    from gradcam import generate_heatmap
    print("gradcam import OK")
except Exception as e:
    print("gradcam import ERROR:", e)
    traceback.print_exc()

try:
    from model import get_model, get_extractor
    print("get_model/get_extractor OK")
except Exception as e:
    print("get_model/get_extractor ERROR:", e)
    traceback.print_exc()
