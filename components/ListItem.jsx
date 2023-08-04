import Item from "./item";

const ListItem = ({ items }) => {
    return (
        <>
            {items.map(item =>
                <Item key={item.id} item={item}/>
            )}
        </>
    );
};

export default ListItem;