'use client'

import setCanvasPreview from '@/setCanvasPreview';
import { ChangeEvent, SyntheticEvent, useRef, useState } from 'react';
import ReactCrop, { centerCrop, convertToPixelCrop, Crop, makeAspectCrop } from 'react-image-crop';

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;

interface Params {
    closeModal: () => void;
    updateImage: (url: File) => void;
}

const ImageCropper = ({ updateImage, closeModal }: Params) => {
    const imageRef = useRef<HTMLImageElement | null>(null);
    const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const [img, setImg] = useState<string>('');
    const [crop, setCrop] = useState<Crop>({
        unit: '%',
        x: 25,
        y: 25,
        width: 50,
        height: 50
    });
    const [error, setError] = useState<string>('')

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.addEventListener("load", () => {
            const imageElement = new Image();
            const imageUrl = reader.result?.toString() || "";
            imageElement.src = imageUrl;

            imageElement.addEventListener("load", (ev: Event) => {
                if (error) {
                    setError("");
                }
                const { naturalHeight, naturalWidth } = ev.currentTarget as HTMLImageElement;

                if (naturalHeight < MIN_DIMENSION || naturalWidth < MIN_DIMENSION) {
                    setError('Image must be at least 150 x 150 pixels');
                    return setImg('');
                }

            })
            setImg(imageUrl);
            imageRef.current = imageElement;
        });

        reader.readAsDataURL(file);
    };

    const onImageLoad = (e: SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;
        const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

        const crop = makeAspectCrop(
            {
                unit: "%",
                width: cropWidthInPercent
            },
            ASPECT_RATIO,
            width,
            height
        );

        const centeredCrop = centerCrop(crop, width, height);

        setCrop(centeredCrop);
    }

    const handleCropClick = () => {
        if (imageRef.current && previewCanvasRef.current) {
            setCanvasPreview(
                imageRef.current,
                previewCanvasRef.current,
                convertToPixelCrop(crop, imageRef.current.width, imageRef.current.height)
            );

            const dataURL = previewCanvasRef.current.toDataURL();
            const croppedImageFile = dataURLToFile(dataURL, 'cropped-image.png');
            updateImage(croppedImageFile);
            closeModal();
        } else {
            setError('Image or Canvas is not ready for cropping.');
        }
    };

    const dataURLToFile = (dataURL: string, filename: string): File => {
        const arr = dataURL.split(',');

        if (arr.length !== 2) {
            throw new Error("Invalid data URL");
        }

        const mimeMatch = arr[0].match(/:(.*?);/);

        if (!mimeMatch) {
            throw new Error("MIME type not found in data URL");
        }

        const mime = mimeMatch[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], filename, { type: mime });
    };


    return (
        <>
            <label className="block mb-3 w-fit">
                <span className='sr-only'>Choose Product Picture</span>
                <input
                    type="file"
                    id="image"
                    name="image"
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:bg-gray-700 file:text-sky-300 hover:file:bg-gray-600"
                    onChange={handleChange}
                    accept="image/*"
                />
            </label>
            {
                error && <p className="text-red-500 text-xs">{error}</p>
            }

            {
                img && (
                    <div className="flex flex-col items-center">
                        <ReactCrop
                            crop={crop}
                            circularCrop
                            keepSelection
                            aspect={ASPECT_RATIO}
                            minWidth={MIN_DIMENSION}
                            onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
                        >
                            <img
                                src={img}
                                alt="Upload"
                                style={{
                                    maxHeight: "70vh"
                                }}
                                ref={imageRef}
                                onLoad={onImageLoad}
                            />
                        </ReactCrop>

                        <button className="text-white font-mono text-xs py-2 px-4 rounded-2xl mt-4 bg-sky-500 hover:bg-sky-600" onClick={handleCropClick}>
                            Crop Image
                        </button>
                    </div>
                )
            }

            {
                img && (
                    <canvas
                        className="mt-4"
                        ref={previewCanvasRef}
                        style={{
                            display: "none",
                            objectFit: "contain",
                            width: 150,
                            height: 150,
                        }} />
                )
            }
        </>
    );
};

export default ImageCropper;
