# このファイルで import することで alembic autogenerate がモデルを認識する
from .venue import Venue             # noqa: F401
from .bet_type import BetType        # noqa: F401
from .race import Race               # noqa: F401
from .horse import Horse             # noqa: F401
from .prediction import Prediction   # noqa: F401
from .bet import Bet                 # noqa: F401
from .result import Result           # noqa: F401
