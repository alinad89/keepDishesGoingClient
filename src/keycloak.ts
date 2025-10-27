// src/keycloak.ts
import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
    url: "http://localhost:8180/",
    realm: "keepdishesgoing",
    clientId: "frontend-client",
});


export default keycloak;
