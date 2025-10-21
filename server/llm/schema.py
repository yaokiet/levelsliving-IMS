from pydantic import BaseModel, Field
from typing import List, Union, Literal, Optional

class DataPoint(BaseModel):
    """
    A single labeled value for a data point in a bar or line chart.
    """
    label: str = Field(..., description="The name of the data series.")
    value: float = Field(..., description="The numerical value for the data point.")

class DataSet(BaseModel):
    """
    A data point for charting, representing a single x-axis category 
    with multiple labeled values.
    """
    x: str = Field(..., description="The x-axis label for this data point.")
    data: List[DataPoint] = Field(..., description="An array of labeled values for this x-axis label.")

class BarLineChartData(BaseModel):
    """
    The data structure for a bar or line chart.
    """
    type: Literal["bar", "line"] = Field(..., description="The type of chart to render.")
    datasets: List[DataSet] = Field(
        ..., 
        description="An array of data points for charting, where each object represents a single x-axis category with multiple labeled values."
    )

class PieChartData(BaseModel):
    """
    The data structure for a pie chart.
    """
    type: Literal["pie"] = Field(..., description="The type of chart to render.")
    labels: List[str] = Field(..., description="An array of strings for the labels of each pie slice.")
    data: List[float] = Field(..., description="The numerical data corresponding to each label.")

class ResponseSchema(BaseModel):
    """
    The main response model.
    """
    response: str = Field(
        ..., 
        description="The message to display to the user. If a chart is generated, this should be key insights about the chart. Formatted as a markdown string."
    )
    data: Optional[Union[BarLineChartData, PieChartData]] = Field(
        None, 
        description="The data for the chart, which can be for a bar, line, or pie chart."
    )