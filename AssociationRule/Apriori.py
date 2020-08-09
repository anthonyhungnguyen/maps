import csv
import json

import pandas as pd
from mlxtend.frequent_patterns import apriori, association_rules
from mlxtend.preprocessing import TransactionEncoder


"""Association Rule bases on Apriori using Mlextend library."""

data = []
with open('travelData.csv', 'r') as f:
    reader = csv.reader(f, delimiter=',')
    for row in reader:
        data.append(row)
f.close()
te = TransactionEncoder()
te_enc = te.fit_transform(data)
data_encoded = pd.DataFrame(te_enc, columns=te.columns_)
frequ_itemset_apriori = apriori(
    data_encoded, min_support=0.01, use_colnames=True)
rules = association_rules(frequ_itemset_apriori,
                          metric='confidence', min_threshold=0.5)
# print(rules['antecedents'].values.tolist())
mask = list(map(lambda x: True if len(list(x)) == 1 else False,
                rules['antecedents'].values.tolist()))
rules = rules[mask]
mask2 = list(map(lambda x: False if len(list(x)) == 1 and list(
    x)[0] == 'bank' else True, rules['consequents'].values.tolist()))
result = rules[mask2].query('lift>1')
print(result)
ant = [list(x) for x in rules[mask2].query('lift>1')['antecedents']]
con = [list(x) for x in rules[mask2].query('lift>1')['consequents']]
process = zip(ant, con)
result = {}
for index in process:
    ant, con = index
    if ant[0] not in result.keys():
        result[ant[0]] = con
    elif len(con) > len(result[ant[0]]):
        result[ant[0]] = con
with open('rules.json', 'w') as outfile:
    json.dump(result, outfile)
