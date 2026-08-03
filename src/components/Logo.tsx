interface LogoProps {
	withWordmark?: boolean;
	className?: string;
}

// Brand mark: a lime tile with an ink "uptick" - money trending up. The tile
// uses accent/on-accent tokens so it reads on both cream and dark backgrounds.
const Logo = ({ withWordmark = true, className = "" }: LogoProps) => (
	<div className={`flex items-center gap-2 ${className}`}>
		<span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-on-accent">
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
				<path
					d="M4 15.5L10 9.5L13.5 13L20 6.5"
					stroke="currentColor"
					strokeWidth="2.4"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<circle cx="20" cy="6.5" r="1.9" fill="currentColor" />
			</svg>
		</span>
		{withWordmark && (
			<span className="text-xl font-bold tracking-tight text-foreground">FinAI</span>
		)}
	</div>
);

export default Logo;
