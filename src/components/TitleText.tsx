const TitleText = ({ title }: { title: string }) => {
	return (
		<div className="mb-6">
			<h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
				{title}
			</h1>
		</div>
	);
};

export default TitleText;
