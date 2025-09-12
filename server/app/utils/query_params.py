from typing import Optional, List

def parse_query_list(param: Optional[str]) -> Optional[List[str]]:
    """
    Parse a query parameter that may be a comma-separated or ampersand-separated string
    into a list of strings.
    """
    if not param:
        return None
    # Accept comma, ampersand, or semicolon as separators
    for sep in [",", "&", ";"]:
        if sep in param:
            return [item.strip() for item in param.split(sep) if item.strip()]
    return [param.strip()]