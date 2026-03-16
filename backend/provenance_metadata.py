from PIL import Image, ExifTags
import io


def extract_metadata(image_bytes):

    image = Image.open(io.BytesIO(image_bytes))

    exif_data = image._getexif()

    metadata = {}

    if exif_data:
        for tag_id, value in exif_data.items():

            tag = ExifTags.TAGS.get(tag_id, tag_id)

            metadata[tag] = value

    return metadata


def simplify_metadata(metadata):

    important = {
        "camera_make": metadata.get("Make"),
        "camera_model": metadata.get("Model"),
        "software": metadata.get("Software"),
        "timestamp": metadata.get("DateTime"),
        "gps_info": metadata.get("GPSInfo")
    }

    return important