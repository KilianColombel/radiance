interface LibraryItemProps {
  icon: string;
  name: string;
}

function LibraryItem({ icon, name }: LibraryItemProps) {
  return (
    <div className="library-item">
      <i className={`bi ${icon}`}></i>
      <div className="item-name">{name}</div>
    </div>
  );
};

export default LibraryItem;