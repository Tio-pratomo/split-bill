import { getAvatarFallback } from '../../utils/avatar'

function AvatarImage({ src, alt, className = '' }) {
  return (
    <img
      src={src || getAvatarFallback()}
      alt={alt}
      className={`h-12 w-12 rounded-full object-cover ring-2 ring-white ${className}`}
      onError={event => {
        event.currentTarget.src = getAvatarFallback()
      }}
    />
  )
}

export default AvatarImage
