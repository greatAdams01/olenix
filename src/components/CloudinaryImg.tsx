import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';

const cld = new Cloudinary({ cloud: { cloudName: 'diymsgmep' } });

interface Props {
  publicId: string;
  className?: string;
  alt?: string;
}

export default function CloudinaryImg({ publicId, className, alt }: Props) {
  if (!publicId) return null;

  // If the stored string is a full URL or a legacy local path (/img/...), use a regular img tag
  if (publicId.startsWith('http://') || publicId.startsWith('https://') || publicId.startsWith('/')) {
    return <img src={publicId} alt={alt || 'Image'} className={className} loading="lazy" />;
  }

  // Otherwise, assume it is a Cloudinary public ID
  const img = cld
    .image(publicId)
    .format('auto') // Optimize delivery format
    .quality('auto') // Optimize delivery quality
    .resize(auto().gravity(autoGravity()).width(800).height(600)); // Auto crop/resize appropriately for menu images

  return <img src={img.toURL()} className={className} alt={alt || 'Image'} loading="lazy" />;
}
