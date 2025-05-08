using StatsBase
using Statistics
#include("descriptive_stats.jl")

function descriptive_stats(descriptive_statistics_categories, data)
    descriptive_stats_response = Dict()
    if "mean" in descriptive_statistics_categories
        descriptive_stats_response["mean"]=mean(data)
    end
    if "median" in descriptive_statistics_categories
        descriptive_stats_response["median"]=median(data)
    end
    if "mode" in descriptive_statistics_categories
        descriptive_stats_response["mode"]=mode(data)
    end
    if "variance" in descriptive_statistics_categories
        descriptive_stats_response["variance"]=var(data)
    end
    if "standard_deviation" in descriptive_statistics_categories
        descriptive_stats_response["standard_deviation"]=std(data)
    end
    if "quartiles" in descriptive_statistics_categories
        descriptive_stats_response["quartiles"]=quantile(data, [0.25,0.5,0.75])
    end
    if "skewness" in descriptive_statistics_categories
        descriptive_stats_response["skewness"]= skewness(data)
    end
    if "kurtosis" in descriptive_statistics_categories
        descriptive_stats_response["kurtosis"]= kurtosis(data)
    end
    println("$descriptive_stats_response")
    return descriptive_stats_response
end