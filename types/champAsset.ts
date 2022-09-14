export interface ChampAsset_type {
    type: Type;
    format: string;
    version: Version;
    data: { [key: string]: Datum };
}

export interface Datum {
    version: Version;
    id: string;
    key: string;
    name: string;
    title: string;
    blurb: string;
    info: Info;
    image: Image;
    tags: Tag[];
    partype: Partype;
    stats: { [key: string]: number };
}

export interface Image {
    full: string;
    sprite: Sprite;
    group: Type;
    x: number;
    y: number;
    w: number;
    h: number;
}

export enum Type {
    Champion = 'champion',
}

export enum Sprite {
    Champion0PNG = 'champion0.png',
    Champion1PNG = 'champion1.png',
    Champion2PNG = 'champion2.png',
    Champion3PNG = 'champion3.png',
    Champion4PNG = 'champion4.png',
    Champion5PNG = 'champion5.png',
}

export interface Info {
    attack: number;
    defense: number;
    magic: number;
    difficulty: number;
}

export enum Partype {
    기력 = '기력',
    기류 = '기류',
    마나 = '마나',
    보호막 = '보호막 ',
    분노 = '분노',
    없음 = '없음',
    열기 = '열기',
    용기 = '용기',
    투지 = '투지',
    피의샘 = '피의 샘',
    핏빛격노 = '핏빛 격노',
    흉포 = '흉포',
}

export enum Tag {
    Assassin = 'Assassin',
    Fighter = 'Fighter',
    Mage = 'Mage',
    Marksman = 'Marksman',
    Support = 'Support',
    Tank = 'Tank',
}

export enum Version {
    The1261 = '12.6.1',
}
