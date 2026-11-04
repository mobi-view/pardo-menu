import Link from "next/link";

type CategoryCardProps = {
    href: string;
    name: string;
    imageUrl: string | null;
};

export default function CategoryCard({ href, name, imageUrl }: CategoryCardProps) {
    return (
        <Link href={href} className="card">
            <div className="card-text">
                <h2>{name}</h2>
                <span className="card-line"></span>
                <span className="card-arrow">
                    <svg viewBox="0 0 24 24" className="icon">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                </span>
            </div>
            {imageUrl && <img src={imageUrl} alt={name} />}
        </Link>
    );
}