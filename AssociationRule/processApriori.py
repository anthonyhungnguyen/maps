import requests
import pandas as pd 
import numpy as np 

"""Drop redundant data."""
dataset = pd.read_csv('processData.csv', header=None)
dataset.columns = ["userID", "date", "type"]
users = list(set(dataset["userID"].values))
with open('travelData.csv', 'w') as f:
    for user in users:
        dataDate = dataset[dataset["userID"] == user]
        dates = list(set(dataDate["date"]))
        for date in dates:
            event = list(set(dataset[dataset["userID"] == user][dataset["date"] == date]["type"].values))
            f.write(','.join(event))
            f.write('\n')
f.close()
