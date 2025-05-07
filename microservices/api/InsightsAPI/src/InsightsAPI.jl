module InsightsAPI

using HTTP
using JSON3
using Oxygen

@get "/greet" function()
    return "Welcome to the Insights API!"
end

@post "/" function(req::HTTP.Request)
    try
        body_string = String(req.body)
        println("Recevied request body: $body_string")

        payload = JSON3.read(body_string)
        println("Parsed JSON payload: $payload")

        response_data = Dict("received_data" => payload, "status" => "success")

        return response_data

    catch e
        @error "Error processing request: $e"
        return HTTP.Response(400, JSON3.write(Dict("error" => "Invalid request payload.")))
    end

end

function main()
    Oxygen.serve()
    println("InsightsAPI server has started and is listing for requests")
end

if abspath(PROGRAM_FILE) == @__FILE__
    main()
end



greet() = print("Hello World!")

end # module InsightsAPI
