import Link from "next/link";

type ItemCardProps = {
    href: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    detailsLabel: string;
    imageUrl: string | null;
};

export default function ItemCard({
    href,
    name,
    description,
    price,
    currency,
    detailsLabel,
    imageUrl,
}: ItemCardProps) {
    return (
        
        <div className="item-card">
            
            {imageUrl && <img src={imageUrl} alt={name} />}
            <div className="item-info">
                <h2>{name}</h2>
                <p>{description}</p>
                <div className="item-bottom">
                    <span className="item-price">
                        {Number(price).toFixed(2)} <small>{currency}</small>
                    </span>
                    <Link href={href} className="item-details">
                        {detailsLabel}
                    </Link>
                </div>
            </div>
        </div>
    );
}