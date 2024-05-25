

interface Address {
    number: number;
    street: string;
    city: string;
    postalCode: string;
    country: string;
}

enum Role {
    ROLE_USER = "User",
    ROLE_STORE_KEEPER = "Store Keeper",
    ROLE_ADMIN = "Admin",
    ROLE_COMPTA = "Accounter"
}

export default interface User {
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    number?: string;
    address?: Address;
    roles: Array<Role>;
    created_at: Date;


}