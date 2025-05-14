import NextImage from 'next/image'

interface ImageProperties {
	src: string
	name: string
	additionalClass?: string
}

export default function Image({ src, name, additionalClass }: ImageProperties) {
	return (
		<div className={`relative ${additionalClass ?? 'w-[20%]'}`}>
			<NextImage
				src={src || '/placeholder.png'}
				alt={`Logo de ${name}`}
				fill
				className="object-contain"
				priority
				sizes="(max-width: 768px) 20vw, (max-width: 1200px) 15vw, 10vw"
			/>
		</div>
	)
}
