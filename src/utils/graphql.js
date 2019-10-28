const handleQueryErrors = (error) => {
    let errors = [];
    if (error.networkError && error.networkError.result) {
        (error.networkError.result.errors).map((apoloError) =>
            errors.push(apoloError.message)
        );
    } else {
        errors=error.graphQLErrors[0].message;
    }

    throw errors;
};

export const execute = (client, type, query, variables) => {
    switch (type) {
        case "query":
            return client.query({
                query: query,
                variables: variables,
                fetchPolicy: 'network-only'
            }).then(response => {
                return response;
            }).catch(error => {
                handleQueryErrors(error);
            });

        case "mutation":
            return client.mutate({
                mutation: query,
                variables: variables,
                fetchPolicy: 'no-cache'
            }).then(response => {
                return response;
            }).catch(error => {
                handleQueryErrors(error);
            });

        default:
            return client.query({
                query: query,
                variables: variables,
                fetchPolicy: 'network-only'
            }).then(response => {
                return response;
            }).catch(error => {
                handleQueryErrors(error);
            });
    }
}