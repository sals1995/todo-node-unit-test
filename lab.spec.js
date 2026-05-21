describe("lab testing:", () => {

    describe("users routes:", () => {
        it("(GET /api/user/search) should respond with the correct user with the name requested",  () => { 
            // Note: user name must be sent in request query not request params
        })
        it("GET /api/user/search with invalid name should respond with status 404 and '... no user with this name ...' message",  () => { })

    })


    describe("todos routes:", () => {
        it("(PATCH /todo) with id and title: should respond with status 200 and the new todo",  () => { })

        it("(GET /api/todo/user): should respond with the user's all todos",  () => { })
        it("(GET /api/todo/user): (for a user hasn't any todo), should respond with status 200 and 'Couldn't find any todos ...' message",  () => { })

    })



})