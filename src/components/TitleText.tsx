const TitleText = ({title}: {title: string}) => {
    return (
        <div className="p-2 mb-4 border-b border-border">
            <h1 className="text-2xl font-semibold text-text-muted">{title}</h1>
        </div>
    )
};

export default TitleText;