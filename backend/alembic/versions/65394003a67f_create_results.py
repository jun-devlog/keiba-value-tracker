"""create_results

Revision ID: 65394003a67f
Revises: 4403cdba6d55
Create Date: 2026-07-10 03:58:57.209287

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '65394003a67f'
down_revision: Union[str, None] = '4403cdba6d55'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'results',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('race_id', sa.Integer(), nullable=False),
        sa.Column('order_of_finish', sa.String(length=255), nullable=True),
        sa.Column('total_return', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['race_id'], ['races.id']),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_results_id'), 'results', ['id'], unique=False)
    op.create_index(op.f('ix_results_race_id'), 'results', ['race_id'], unique=True)


def downgrade() -> None:
    op.drop_index(op.f('ix_results_race_id'), table_name='results')
    op.drop_index(op.f('ix_results_id'), table_name='results')
    op.drop_table('results')
