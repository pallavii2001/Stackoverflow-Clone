const errorMessageFunction = (status, data) => {
    
    return {
        status: status,
        error: data
    };
};

module.exports=errorMessageFunction
