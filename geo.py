import geopandas as gpd
import os

def filter_columns(df, cols_to_keep):
    """Filter Pandas table df keeping only columns in keep"""
    cols = list(df)
    for col in cols_to_keep:
        cols.remove(col)
    return df.drop(columns=cols)

def main():
    url = "http://geo.ipisresearch.be/geoserver/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:cod_mines_curated_all_opendata_p_ipis&outputFormat=application%2Fjson"
    columns = ["id", "source", "project", "name", "longitude", "latitude", "province", "village", "workers_numb", "is_gold_mine", "mineral1", "armed_group1", "type_armed_group1", "geometry"]
    data = filter_columns(gpd.read_file(url), columns)

    output = "data.json"
    if os.path.isfile(output):
        os.remove(output)

    data.to_file(output, driver="GeoJSON")

if __name__ == '__main__':
    main()
