module InsightsAPI

using HTTP
using JSON3
using Oxygen

include("descriptive_stats_api.jl")

@get "/greet" function()
    return "Welcome to the Insights API!"
end

@post "/" function(req::HTTP.Request)
    try
        body_string = String(req.body)
        println("Recevied request body: $body_string")

        payload = JSON3.read(body_string)
        request = payload[:request]
        data = payload[:data][:x] #access the actual data (the independent variables) inside the data field.
        columns = payload[:data][:columns]
        println("Parsed JSON payload: $payload")
        response_data = Dict()
        
        #send the data to the right place based on request types.
        if haskey(request, :descriptive_statistics) && length(data) == 1 # data is in form x: [[...], [...],...]
            println("descriptive_statistics")
            descriptive_statistics_categories = request[:descriptive_statistics]
            response_data["descriptive_stats"] = descriptive_stats(descriptive_statistics_categories, data[1])

        elseif haskey(request, :descriptive_statistics) && length(data) > 1 
            descriptive_statistics_categories = request[:descriptive_statistics]
            descriptive_stats_by_column = Dict()
            for (i, column) in enumerate(columns)
                descriptive_stats_by_column[column] = descriptive_stats(descriptive_statistics_categories, data[i])
                println("column: $(columns[i])")
                println("data: $(data[i])")
            end
            response_data["descriptive_stats"] = descriptive_stats_by_column
            println("$response_data")
        end
                
        #response_data = Dict("received_data" => payload, "status" => "success")
        println("$response_data")
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
