### ENDPOINTS

`/recipes`

    GET - returns a list of all recipes
        query parameters
            -   limit: number (0,*9), number of results to be returned per page. DEFAULT: 10
            -   page: number(0, *9), to set skip position
        
        Does not require authentication.
        Example
            - /recipes
            - /recipes?page=1&limit=2
    
    POST - Create a new recipe
        body parameters
            -   name: string {required}
            -   difficulty: number(1 - 3) {required}
            -   prepTime: string(format: "10mins", "1hr") {required}
            -   vegetarian: boolean
            
        Authentication
         Basic auth header - username and password required. For this test, the username is username and password is passwrod.
         {username: username, password: password}
         
`/recipes/:id`
    
    GET - Returns a single recipe
        parameter(:id) - where id is the uniqueID of the recipe.
    
    PUT - Updates a single recipe
        parameter(:id) - where id is the uniqueID of the recipe.
        body parameters
            -   name: string
            -   difficulty: number(1 - 3)
            -   prepTime: string(format: "10mins", "1hr"),
            -   vegetarian: boolean
        
        Authentication
         Basic auth header - username and password required. For this test, the username is username and password is passwrod.
         {username: username, password: password}
    
    DELETE - Deletes a single recipe record
        parameter(:id) - where id is the uniqueID of the recipe.
        
        Authentication
         Basic auth header - username and password required. For this test, the username is username and password is passwrod.
         {username: username, password: password}
         
`/recipes/:id/rating`

    POST - add a new rating to a receipe
        parameter(:id) - where id is the uniqueID of the recipe.
        body parameters
            -   rating: number(1 - 5)
            
`/search/recipes`
    
    GET - Search for recipes by fields
        query parameters
            -   name: string
            -   difficulty: number(1 - 3)
            -   prepTime: string(format: "10mins", "1hr"),
            -   vegetarian: boolean
            -   page - number(0, *9), to set skip position
            -   limit: number (0,*9), number of results to be returned per page. DEFAULT: 10
            
ERROR CODES

    200 - OK
    400 - BAD REQUEST
    404 - NOT FOUND
    500 - SERVER ERROR
    503 - NOT IMPLEMENTED
            
ERROR TYPES

    'Recipe not found'
    'Recipe not updated'
    'Recipe not deleted'
    Validation errors