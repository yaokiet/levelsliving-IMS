import os
import json
import copy
def get_schema():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    with open(f"{current_dir}/schema.json", "r") as schema_file:
        schema = json.load(schema_file)
    return schema['databases']

def get_schema_of_database(database_name):
    schema = get_schema()
    if database_name in schema:
        return schema[database_name]
    else:
        raise ValueError(f"Database '{database_name}' not found in schema.")

def get_summary_of_database(database_name):
    """
    Retrieves a summary of the specified database from the schema.

    Args:
        database_name (str): The name of the database to retrieve.

    Returns:
        dict: A dictionary containing the summary of the database, or None if not found.
    """
    schema = get_schema_of_database(database_name)
    if not schema:
        return None  # Database not found

    # Create a summary dictionary with relevant information.
    summary = {
        "database_name": database_name,
        "description": schema.get("description", ""),
        "tables": [{"name": table["table_name"], "description": table.get("description", "")} for table in schema.get("tables", [])],
        "enums": schema.get("enums", []),
    }

    return summary

def get_table_schema(database_name, table_name):
    schema = get_schema_of_database(database_name)
    if not schema:
        return None  # Database not found

    tables = schema.get("tables", [])
    enums = schema.get("enums", [])

    # Find the table by its name.
    table = next((t for t in tables if t.get("table_name") == table_name), None)

    if not table:
        return None  # Table not found

    # Create a deep copy to avoid modifying the original schema object.
    table_schema_copy = copy.deepcopy(table)

    # Create a dictionary for quick enum lookup.
    enum_map = {e["name"]: e for e in enums}

    # Iterate over columns to find and inject enum definitions.
    for column in table_schema_copy.get("columns", []):
        # Check for both regular and array enum types (e.g., 'department_enum' or 'department_enum[]')
        enum_type_name = column.get("data_type", "").replace("[]", "")

        if enum_type_name in enum_map:
            # If the column's data type is a defined enum, attach the enum's values.
            column["enum_values"] = enum_map[enum_type_name]

    return table_schema_copy


def get_table_names_of_database(database_name):
    schema = get_schema_of_database(database_name)
    if not schema:
        return []  # Database not found

    tables = schema.get("tables", [])
    return [table["table_name"] for table in tables]