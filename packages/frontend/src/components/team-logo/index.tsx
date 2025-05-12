import Image from 'next/image'

interface TeamLogoProperties {
	logo: string
	name: string
	additionalClass?: string
}

export default function TeamLogo({
	logo,
	name,
	additionalClass,
}: TeamLogoProperties) {
	return (
		<div className={`relative ${additionalClass ?? 'w-[20%]'}`}>
			<Image
				src={logo || '/placeholder-logo.png'}
				alt={`Logo de ${name}`}
				fill
				className="object-contain"
				priority
				sizes="(max-width: 768px) 20vw, (max-width: 1200px) 15vw, 10vw"
			/>
		</div>
	)
}
