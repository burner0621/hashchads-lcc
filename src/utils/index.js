const { Client, AccountId } = require("@hashgraph/sdk");

export const isAddress = async (value) => {
    const client = Client.forMainnet();

    const accountId = AccountId.fromString(value);
    try {
        const res = await client.getAccountInfo(accountId)
        return true
    } catch {
        return false
    }
}