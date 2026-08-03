// Shimmering placeholder block. Compose several to mirror the real layout while
// data loads. Sizing/shape comes from the passed className (height/width/rounded).
const Skeleton = ({ className = "" }: { className?: string }) => (
	<div className={`skeleton ${className}`} aria-hidden="true" />
);

export default Skeleton;
