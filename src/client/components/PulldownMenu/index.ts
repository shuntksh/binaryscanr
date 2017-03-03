import PulldownMenu from "./PulldownMenu";

export interface MenuItemProps {
    label: string;
}

export interface PulldownMenuProps {
    menus: MenuItemProps[];
}

export default PulldownMenu;
