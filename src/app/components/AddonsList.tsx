import type { ItemAddon } from "@/type/menu";

type AddonsListProps = {
    title: string;
    addons: ItemAddon[];
    selectedIds: string[];
    onToggle: (addonId: string) => void;
    getName: (addon: ItemAddon) => string;
    currency: string;
};

export default function AddonsList({
    title,
    addons,
    selectedIds,
    onToggle,
    getName,
    currency,
}: AddonsListProps) {
    if (addons.length === 0) return null;

    const sortedAddons = [...addons].sort(
        (first, second) => first.sort_order - second.sort_order
    );

    return (
        <div className="addons">
            <h2 className="addons-title">{title}</h2>
            {sortedAddons.map((addon) => (
                <label className="addon-row" key={addon.id}>
                    <input
                        type="checkbox"
                        className="addon-checkbox"
                        checked={selectedIds.includes(addon.id)}
                        onChange={() => onToggle(addon.id)}
                    />
                    <span className="addon-name">{getName(addon)}</span>
                    <span className="addon-price">
                        +{Number(addon.price).toFixed(2)} {currency}
                    </span>
                </label>
            ))}
        </div>
    );
}