export type AccountBook = {
    _id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export type AccountBookWithMember = {
    _id: string;
    userId: string;
    role: 'owner' | 'editor' | 'viewer';
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
    accountBookId: AccountBook;
}