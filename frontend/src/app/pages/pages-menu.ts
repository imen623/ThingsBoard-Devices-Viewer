export interface AppMenuItem {
  title: string;
  icon?: string;
  link: string;
  home?: boolean;
}

export const MENU_ITEMS: AppMenuItem[] = [
  {
    title: 'Dashboard',
    icon: '',
    link: '/pages/dashboard',
    home: true,
  },
];
